import React, { useState, useCallback } from 'react'

import { auth } from "../firebase"
import { withRouter } from "react-router-dom"

const Reset = (props) => {
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)

  const procesarDatos = (e) => {
    //Evitar el metodo GET por defecto
    e.preventDefault()

    if (!email.trim()) {
      setError("Ingrese un email")
      return
    }
    console.log("Correcto...")
    setError(null)

    recuperar()
  }

  const recuperar = useCallback(async () => {
    try {
      await auth.sendPasswordResetEmail(email)
      console.log("correo enviado")

      //redireccionando a la pagina del login 
      props.history.push("login")
    } catch (error) {
      console.log(error)
      if (error.code === "auth/user-not-found") {
        setError("Este correo no se encutra registrado.")

      }
    }
  }, [email, props.history])

  return (
    <div className="mt-5">
      <h3 className="text-center"> Reiniciar contraseña</h3>
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
              placeholder="Ingrese email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} />

            <button
              type="submit"
              className="btn btn-dark btn-lg btn-block">Reiniciar contraseña</button>


          </form>
        </div>
      </div>
    </div>
  )
}
export default withRouter(Reset)