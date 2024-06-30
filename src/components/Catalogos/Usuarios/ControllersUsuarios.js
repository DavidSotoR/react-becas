function ControllerUsuarios() {
    const GenerarPassword = () => {
        const length = 12;
        const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const lowerChars = "abcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        const allChars = upperChars + lowerChars + numbers;
    
        let password = "";
    
        password += upperChars[Math.floor(Math.random() * upperChars.length)];
    
        password += numbers[Math.floor(Math.random() * numbers.length)];
    
        for (let i = 2; i < length; i++) {
            password += allChars[Math.floor(Math.random() * allChars.length)];
        }
    
        password = password.split('').sort(() => 0.5 - Math.random()).join('');
    
        return password;
    }
    
}

export default ControllerUsuarios;