export const loginService = async (datosPost) => {
    
    var resp = {
        success: true,
        message: 'Inicio Sesion',
        role: datosPost.role
    }

    return resp
}