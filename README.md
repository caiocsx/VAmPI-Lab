# VAmPI Lab UI

Frontend educacional para demonstração e estudo de vulnerabilidades em APIs REST utilizando o VAmPI (Vulnerable API).

## Sobre o Projeto

O VAmPI Lab UI é uma interface web criada para facilitar a visualização e compreensão de vulnerabilidades presentes em APIs REST.

Enquanto o VAmPI original é normalmente utilizado através do Swagger UI ou ferramentas como Postman, este projeto oferece uma interface gráfica que permite demonstrar ataques, analisar requisições e visualizar respostas de forma mais intuitiva e didática.

O objetivo é auxiliar em atividades acadêmicas, treinamentos de segurança ofensiva e defensiva, laboratórios de testes e apresentações educacionais.

## Objetivos

* Facilitar o aprendizado sobre segurança em APIs REST.
* Demonstrar vulnerabilidades de forma visual.
* Exibir requisições e respostas em tempo real.
* Servir como apoio para aulas, seminários e laboratórios.
* Permitir a exploração controlada de falhas conhecidas do VAmPI.

## Tecnologias

### Frontend

* React
* TypeScript
* Vite
* Shadcn UI
* Tailwind CSS

### Backend

* VAmPI (Vulnerable API)

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login
* Informações do usuário autenticado

### Exploração de Vulnerabilidades

#### Broken Access Control

Demonstração de escalada vertical de privilégios através da criação de usuários com permissões administrativas.

#### User Enumeration

Identificação de usuários válidos através de mensagens de erro distintas durante o processo de autenticação.

#### SQL Injection

Demonstração de consultas vulneráveis utilizando entradas manipuladas pelo usuário.

#### JWT Analysis

Visualização e utilização de tokens JWT para acesso a recursos protegidos.

## Executando o Projeto

### Clonar o repositório

```bash
git clone https://github.com/caiocsx/VAmPI-Lab-UI.git
cd VAmPI-Lab-UI
```

### Instalar dependências

```bash
npm install
```

### Executar em modo desenvolvimento

```bash
npm run dev
```

## Executando o VAmPI

```bash
docker compose up -d
```

A API vulnerável ficará disponível em:

```text
http://localhost:5002
```

## Aviso de Segurança

Este projeto possui finalidade exclusivamente educacional.

As vulnerabilidades demonstradas são intencionais e devem ser utilizadas apenas em ambientes controlados de laboratório.

Nunca utilize técnicas apresentadas neste projeto contra sistemas sem autorização explícita.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## Créditos e Atribuições

Este projeto utiliza a API [VAmPi](https://github.com/erev0s/VAmPI), desenvolvida por <b>erev0s<b>.

