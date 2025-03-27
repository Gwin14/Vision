# 📁 Projeto de Integração OneDrive e Notion

## 📝 Descrição do Projeto

Este projeto é uma aplicação web que integra as APIs do Microsoft OneDrive e Notion, permitindo visualização e interação com arquivos de diferentes serviços em uma interface de fluxo de trabalho interativa.

## 🚀 Funcionalidades Principais

- Autenticação OAuth com Microsoft OneDrive
- Autenticação OAuth com Notion
- Listagem de arquivos do OneDrive em árvore interativa
- Visualização de metadados de arquivos
- Drag and Drop de arquivos em diagrama de fluxo
- Documentação automática com Swagger

## 🛠 Tecnologias Utilizadas

### Backend
- Django 4.2
- Django Rest Framework
- MSAL (Microsoft Authentication Library)
- Requests
- django-environ
- drf-spectacular (Swagger)

### Frontend
- React com TypeScript
- React Flow (@xyflow/react)
- Tailwind CSS

## 📦 Pré-requisitos

- Python 3.9+
- Node.js 16+
- Conta de desenvolvedor no Microsoft Azure
- Conta de desenvolvedor no Notion

## 🔧 Configuração do Ambiente

### Backend (Django)

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

2. Crie um ambiente virtual
```bash
python -m venv venv
source venv/bin/activate  # No Windows use `venv\Scripts\activate`
```

3. Instale as dependências
```bash
pip install -r requirements.txt
```

4. Crie um arquivo `.env` com as seguintes variáveis:
```
SECRET_KEY=sua_secret_key
DATABASE_NAME=db.sqlite3

# Configurações Microsoft
MICROSOFT_CLIENT_ID=seu_client_id
MICROSOFT_CLIENT_SECRET=seu_client_secret
MICROSOFT_REDIRECT_URI=http://localhost:8000/microsoftauth/auth/callback/

# Configurações Notion
NOTION_CLIENT_ID=seu_client_id
NOTION_CLIENT_SECRET=seu_client_secret
NOTION_REDIRECT_URI=http://localhost:8000/notionoauth/auth/callback/
```

5. Execute as migrações
```bash
python manage.py migrate
```

### Frontend (React)

1. Navegue até a pasta do frontend
```bash
cd frontend
npm install
```

2. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## 🔐 Autenticação

### Microsoft OneDrive
1. Acesse `/microsoftauth/auth/microsoft/`
2. Faça login com sua conta Microsoft
3. Autorize o acesso aos seus arquivos

### Notion
1. Acesse `/notionoauth/auth/notion/start/`
2. Faça login com sua conta Notion
3. Autorize o acesso à sua integração

## 📊 Documentação da API

Acesse:
- Swagger UI: `/api/docs/`
- ReDoc: `/api/redoc/`

## 🌟 Recursos Principais

- **Visualização de Arquivos**: Liste e explore arquivos do OneDrive
- **Drag and Drop**: Arraste arquivos para um diagrama interativo
- **Metadados**: Visualize informações detalhadas de cada arquivo
- **Navegação em Pastas**: Expanda e explore estrutura de pastas

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça um push (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## ⚠️ Avisos Importantes

- Projeto em estágio de desenvolvimento
- Necessário configurar aplicações no Azure e Notion
