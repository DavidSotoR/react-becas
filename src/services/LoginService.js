export const loginService = async (datosPost) => {
    localStorage.setItem('role', datosPost.role)
    console.log(datosPost);
    var resp = {
        success: true,
        message: 'Inicio Sesion',
        role: datosPost.role
    }

    return resp
}