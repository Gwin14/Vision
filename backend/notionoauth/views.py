# minha_app/views.py

from django.shortcuts import redirect, render
from django.conf import settings
import requests
import base64

def notion_auth_start(request):
    """
    Redireciona o usuário para a URL de autorização do Notion.
    """
    auth_url = (
        f"https://api.notion.com/v1/oauth/authorize?"
        f"client_id={settings.NOTION_CLIENT_ID}&"
        f"redirect_uri={settings.NOTION_REDIRECT_URI}&"
        f"response_type=code"
    )
    return redirect(auth_url)

def notion_auth_callback(request):
    """
    Lida com o callback do Notion após a autorização do usuário.
    """
    code = request.GET.get('code')
    if not code:
        return render(request, 'minha_app/error.html', {'error': 'Código de autorização não fornecido.'})

    # Troca o código por um token de acesso
    token_url = "https://api.notion.com/v1/oauth/token"
    credentials = f"{settings.NOTION_CLIENT_ID}:{settings.NOTION_CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')

    headers = {
        'Authorization': f'Basic {encoded_credentials}',
        'Content-Type': 'application/json',
    }

    data = {
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': settings.NOTION_REDIRECT_URI,
    }

    response = requests.post(token_url, headers=headers, json=data)
    if response.status_code == 200:
        token_data = response.json()
        access_token = token_data.get('access_token')
        # Armazena o token na sessão
        request.session['notion_access_token'] = access_token
        return redirect('user_info')
    else:
        return render(request, 'minha_app/error.html', {'error': 'Falha ao obter o token de acesso.'})

def user_info(request):
    """
    Exibe as informações do usuário e as páginas compartilhadas.
    """
    access_token = request.session.get('notion_access_token')
    if not access_token:
        return redirect('notion_auth_start')

    headers = {
        'Authorization': f'Bearer {access_token}',
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
    }

    # Obtém informações do usuário
    user_response = requests.get('https://api.notion.com/v1/users/me', headers=headers)
    if user_response.status_code != 200:
        return render(request, 'minha_app/error.html', {'error': 'Falha ao obter informações do usuário.'})
    user_info = user_response.json()

    # Obtém as páginas compartilhadas com a integração
    search_payload = {
        "filter": {
            "value": "page",
            "property": "object"
        }
    }
    search_response = requests.post('https://api.notion.com/v1/search', headers=headers, json=search_payload)
    if search_response.status_code != 200:
        return render(request, 'minha_app/error.html', {'error': 'Falha ao obter páginas compartilhadas.'})
    
    pages = search_response.json().get('results', [])

    return render(request, 'user_info.html', {
        'user_info': user_info,
        'pages': pages
    })