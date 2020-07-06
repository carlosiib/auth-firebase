import React, { useState, useCallback } from 'react'
import { auth } from "../firebase"

const Login = () => {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [error, setError] = useState(null)
    const [esRegistro, setEsRegistro] = useState(true)

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
        console.log("Correcto...")
        setError(null)


        if (esRegistro) {
            registrar()
        }
    }

    //register user in firebase
    const registrar = useCallback(async () => {
        try {
            const res = await auth.createUserWithEmailAndPassword(email, pass)
            console.log(res.user)
        } catch (error) {
            console.log(error)
            //error proveniente de firebase
            if (error.code === "auth/invalid-email") {
                setError("Email no valido")
            }
            if (error.code === "auth/email-already-in-use") {
                setError("Email ya utilizado")
            }
        }
    }, [email, pass])

    return (
        <div className="mt-5">
            <h3 className="text-center">{esRegistro ? "Registro de usuarios" : "Login"}</h3>
            <hr />
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8 col-md-6 col-xl-4">
                    <form onSubmit={procesarDatos}>
                        {
                            //si error es true ejecuta todo dentro de (), error = null/falsy
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
                        <button
                            type="submit"
                            className="btn btn-dark btn-lg btn-block">{esRegistro ? "Registrarse" : "Acceder"}</button>
                        <button
                            type="button"
                            className="btn btn-info btn-sm btn-block"
                            onClick={() => setEsRegistro(!esRegistro)}>{esRegistro ? "¿Ya estas registrado?" : "¿No tienes cuenta?"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login
