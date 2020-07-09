import React, { useState, useCallback } from 'react'
import { auth, db } from "../firebase"
import { withRouter } from "react-router-dom"

const Login = (props) => {
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
    } else {
      login()
    }
  }

  //login de usuario
  const login = useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, pass)
      console.log(res.user)
      setEmail("")
      setPass("")
      setError(null)

      //cambio de ruta cuando el usuario haga login
      props.history.push("/admin")

    } catch (error) {
      console.log(error)
      if (error.code === "auth/invalid-email") {
        setError("Email no valido")
      }
      if (error.code === "auth/user-not-found") {
        setError("Email no registrado")
      }
      if (error.code === "auth/wrong-password") {
        setError("Contraseña incorrecta")
      }
    }

  }, [email, pass, props.history])

  //register user in firebase
  const registrar = useCallback(async () => {
    try {
      const res = await auth.createUserWithEmailAndPassword(email, pass)
      console.log(res.user)

      //relacionando nuevo usuario con la colleccion usuarios
      await db.collection("usuarios").doc(res.user.email).set({
        email: res.user.email,
        uid: res.user.uid
      })

      //relacionando id tarea con coleccion tareas
      await db.collection(res.user.id).add({
        name: "Tarea ejemplo",
        fecha: Date.now()
      })

      setEmail("")
      setPass("")
      setError(null)

      //cambio de ruta cuando el usuario se registre
      props.history.push("/admin")

    } catch (error) {
      console.log(error)
      //errores provenientes de firebase
      if (error.code === "auth/invalid-email") {
        setError("Email no valido")
      }
      if (error.code === "auth/email-already-in-use") {
        setError("Email ya utilizado")
      }
    }
  }, [email, pass, props.history])

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
export default withRouter(Login)
