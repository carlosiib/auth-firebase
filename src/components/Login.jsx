import React, { useState } from 'react'

const Login = () => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState(null)

    const procesarDatos = (e) => {
        //Evitar el metodo GET por defecto
        e.preventDefault()

        if (!email.trim()) {
            setError("Ingrese un email")
            return
        }
        if (!pass.trim()) {
            setError("Ingrese un password")
            return
        }
        if (pass.length < 6) {
            setError("Password de 6 caracteres o más")
            return
        }
        //pasando todas las validaciones
        setError(null)
        console.log("Pasando validaciones")
    }
    return (
        <div className="mt-5">
            <h3 className="text-center">Acceso o Registro de usuarios </h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                            error && (
                                <div className="alert alert-danger">{error}</div>
                            )
                        }
                        <input
                            type="email"
                            className="form-control mb-2"
                            placeholder="Ingrese un email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                        <input
                            type="password"
                            className="form-control mb-2"
                            placeholder="Ingrese un password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)} />
                        <button className="btn btn-dark btn-lg btn-block">Registrarse</button>
                        <button className="btn btn-info btn-sm btn-block">¿Ya tienes cuenta?</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login
