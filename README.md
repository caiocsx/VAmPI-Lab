# VAmPI Lab

Frontend educacional para demonstração e estudo de vulnerabilidades em APIs REST utilizando o VAmPI (Vulnerable API).

## Sobre o Projeto

O VAmPI Lab é uma interface web criada para facilitar a visualização e compreensão de vulnerabilidades presentes em APIs REST.

Enquanto o VAmPI original é normalmente utilizado através do Swagger UI ou ferramentas como Postman, este projeto oferece uma interface gráfica que permite demonstrar ataques, analisar requisições e visualizar respostas de forma mais intuitiva e didática.

O objetivo é auxiliar em atividades acadêmicas, treinamentos de segurança ofensiva e defensiva, laboratórios de testes e apresentações educacionais.

## Material do Seminário

A apresentação utilizada durante o seminário está disponível no repositório:

- 📄 https://canva.link/op0kilvt191ormb


## Vulnerabilidades

- Unauthorized Password Change
- Broken Object Level Authorization (BOLA)
- Mass Assignment
- Excessive Data Exposure
- Falta de Rate Limiting

# Preparando o Ambiente

## 1. Clone este repositório, instale as dependências e execute

```bash
git clone https://github.com/caiocsx/VAmPI-Lab.git
cd VAmPI-Lab
```
```bash
npm install
```
```bash
npm run dev
```
A aplicação ficará disponível em:

```text
http://localhost:5173
```

## 2. Clone o projeto original do VAmPI e suba o container

```bash
git clone https://github.com/erev0s/VAmPI.git
cd VAmPI
```
```bash
docker compose up -d
```
A API ficará disponível em:

```text
http://localhost:5002
```

## 3. Popular o banco de dados

Abra a documentação Swagger da API:

```text
http://localhost:5002/ui
```

Execute a requisição responsável por popular o banco de dados.

Esse passo cria os usuários, livros e demais dados necessários para as demonstrações.

# Vulnerabilidades Demonstradas

## 1. Unauthorized Password Change

### Descrição

A rota de alteração de senha utiliza o **username** enviado na URL para identificar qual usuário terá a senha alterada, sem verificar se ele corresponde ao usuário autenticado.

Dessa forma, basta alterar o username na requisição para redefinir a senha de qualquer outro usuário conhecido.

## 2. Broken Object Level Authorization (BOLA)

### Descrição

Ao visualizar um livro, o frontend envia uma requisição para buscar seus detalhes. Como o backend não verifica se o livro pertence ao usuário autenticado, basta alterar o identificador do recurso na requisição para acessar informações de livros pertencentes a outros usuários.

## 3. Mass Assignment

### Descrição

Durante o cadastro, a API aceita campos enviados pelo cliente sem validar quais propriedades podem ser definidas.

Assim, um atacante pode incluir campos como:

```json
{
    "admin": true
}
```

ou testar outras variações (`is_admin`, `isAdmin`, etc.) até encontrar um atributo aceito, criando uma conta com privilégios administrativos.

## 4. Excessive Data Exposure

### Descrição

Algumas rotas retornam mais informações do que o necessário para o funcionamento da aplicação.

Entre os exemplos estão a listagem de usuários, que expõe usernames e e-mails, e a rota de debug disponível pelo Swagger, que revela informações internas da API. Esses dados podem ser utilizados para facilitar outros ataques.

## 5. Falta de Rate Limiting

### Descrição

As rotas de autenticação não possuem limitação de requisições, permitindo um número ilimitado de tentativas de login.

Na pasta `password-forcer/` há um script JavaScript e uma lista de senhas que demonstram como um ataque de força bruta pode ser realizado até encontrar a senha correta de um usuário.

```bash
npm run password-forcer
```

# Aviso de Segurança

Este projeto possui finalidade **exclusivamente educacional**.

Todas as vulnerabilidades demonstradas são intencionais e devem ser utilizadas apenas em ambientes controlados de laboratório.

Nunca utilize as técnicas apresentadas neste projeto contra sistemas sem autorização explícita.

# Licença

Este projeto está sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais informações.

# Créditos

Este projeto utiliza a API vulnerável [VAmPi](https://github.com/erev0s/VAmPI), desenvolvida por **erev0s**:
