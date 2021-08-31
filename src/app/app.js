// TODO: write code here

import RegisterForm from './components/RegisterForm/RegisterForm';
import Tooltip from './components/Tooltip/Tooltip';

console.log('app.js bundled');

const registerForm = new RegisterForm('.form', new Tooltip());

window.registerForm = registerForm;
