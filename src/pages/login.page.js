import { test } from '@playwright/test';

export class LoginPage {
    // техническое описание страницы
    
        constructor (page) {
            this.page = page;
            
            this.loginButton = page.getByRole('button', { name: 'Login' })
            this.nameInput = page.getByRole('textbox', { name: 'Username' })
            this.passwordInput =  page.getByRole('textbox', { name: 'Password' })
        }
    // бизнесовые действия со страницей
    
    async login(name, password) {

        await this.nameInput.click();
        await this.nameInput.fill(name);


        await this.passwordInput.click()
        await this.passwordInput.fill(password);
        
        await this.loginButton.click();
    }

    async open (url) {
        return test.step(`Open ${url}`, async () => {
            await this.page.goto(url);
        })
    }
    
    }