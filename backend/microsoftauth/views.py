# app/views.py
from django.shortcuts import redirect, render
from django.http import HttpResponse, JsonResponse
import msal
import requests
from django.conf import settings

def microsoft_login(request):
    msal_app = msal.ConfidentialClientApplication(
        settings.MICROSOFT_AUTH['CLIENT_ID'],
        authority=settings.MICROSOFT_AUTH['AUTHORITY'],
        client_credential=settings.MICROSOFT_AUTH['CLIENT_SECRET']
    )
    auth_url = msal_app.get_authorization_request_url(
        scopes=settings.MICROSOFT_AUTH['SCOPES'],
        redirect_uri=settings.MICROSOFT_AUTH['REDIRECT_URI']
    )
    return redirect(auth_url)

def auth_callback(request):
    code = request.GET.get('code')
    if code:
        msal_app = msal.ConfidentialClientApplication(
            settings.MICROSOFT_AUTH['CLIENT_ID'],
            authority=settings.MICROSOFT_AUTH['AUTHORITY'],
            client_credential=settings.MICROSOFT_AUTH['CLIENT_SECRET']
        )
        result = msal_app.acquire_token_by_authorization_code(
            code,
            scopes=settings.MICROSOFT_AUTH['SCOPES'],
            redirect_uri=settings.MICROSOFT_AUTH['REDIRECT_URI']
        )
        if 'access_token' in result:
            access_token = result['access_token']
            request.session['access_token'] = access_token
            return redirect('listar_arquivos')
    return redirect('microsoft_login')

def listar_arquivos(request):
    access_token = request.session.get('access_token')
    if not access_token:
        response = JsonResponse({'error': 'Não autenticado'}, status=401)
        response['Access-Control-Allow-Origin'] = '*'
        return response

    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    parent_id = request.GET.get('parentId')
    if parent_id:
        url = f'https://graph.microsoft.com/v1.0/me/drive/items/{parent_id}/children'
    else:
        url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
    
    resp = requests.get(url, headers=headers)
    
    if resp.status_code == 200:
        arquivos = resp.json().get('value', [])
        response = JsonResponse({'arquivos': arquivos})
    else:
        response = HttpResponse("Erro ao acessar o OneDrive.", status=resp.status_code)
    
    response['Access-Control-Allow-Origin'] = '*'
    return response
