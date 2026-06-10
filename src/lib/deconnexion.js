export function deconnecterEtRediriger() {
  localStorage.removeItem('token')
  document.cookie = 'token=; max-age=0; path=/'
  window.location.href = '/connexion'
}
