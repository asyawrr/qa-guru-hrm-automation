import { env } from '../config/env.js';

/*
  Login for API tests: get the login page -> retrieve the token from Devtools -> Sources -> send the form.
  Session cookies remain in the request, and API requests are then sent as authorized.
*/
export class AuthService {
  constructor(request) {
    this.request = request;
    this.loginUrl = `${env.BASE_URL}/web/index.php/auth/validate`;
  }

  /*
    Get the CSRF token from the HTML login page.
    In OrangeHRM, the token is located in the attribute :token=“...”".
    Opened the page in a browser -> View Source -> found this format -> wrote a regex for it.
  */
  _getCsrfTokenFromHtml(html) {
    const match = html.match(/:token="&quot;([^"]+)&quot;"/);
    return match ? match[1] : '';
  }

  /*
    Login: GET login page → retrieve token → POST login + password + token.
  */
  async loginWithForm(username, password) {
    const loginPageUrl = `${env.BASE_URL}/web/index.php/auth/login`;

    const loginPageResponse = await this.request.get(loginPageUrl);
    const html = await loginPageResponse.text();
    const token = this._getCsrfTokenFromHtml(html);

    const response = await this.request.post(this.loginUrl, {
      form: {
        _token: token,
        username,
        password,
      },
      headers: {
        Referer: loginPageUrl,
        Origin: new URL(env.BASE_URL).origin,
      },
      failOnStatusCode: false,
    });

    return response;
  }
}
