import React, { useEffect, useState } from "react";
import { db } from "../firebase";

import moment from "moment"
import "moment/locale/es"

const Firestore = (props) => {

  //DB state
  const [tareas, setTareas] = useState([]);
  //form state
  const [tarea, setTarea] = useState("");
  const [modoEdicion, setModoEdicion] = useState(false);
  const [id, setId] = useState("");
  //pagination
  const [ultimo, setUltimo] = useState(null);
  //disable pagination
  const [desactivar, setDesactivar] = useState(false);


  useEffect(() => {
    const obtenerDatos = async () => {

      try {
        //disable pagination button
        setDesactivar(true)

        //Getting db collections
        //Ligando usuario unico con una coleccion unica
        //limit -> limite de colecciones a cargar por usuario
        const data = await db.collection(props.user.uid)
          .limit(2)
          .orderBy("fecha")
          .get();

        //Reading db collections
        const arrayData = data.docs.map((doc) => ({
          id: doc.id,
          //flating the array collection
          ...doc.data(),
        }));

        //...length -1 -> read the last collection
        setUltimo(data.docs[data.docs.length - 1])

        setTareas(arrayData);

        //know if there are more collection to load
        const query = await db.collection(props.user.uid)
          .limit(2)
          .orderBy("fecha")
          .startAfter(data.docs[data.docs.length - 1])
          .get();
        if (query.empty) {
          console.log("No hay mas documetos ")
          setDesactivar(true)
        } else {
          setDesactivar(false)
        }
      } catch (error) {
        console.log(error);
      }
    };

    obtenerDatos();
  }, [props.user.uid]);

  //form handler
  const agregar = async (e) => {
    e.preventDefault();

    if (!tarea.trim()) {
      console.log("Ingrese datos");
      return;
    }

    try {
      //const db = firebase.firestore();
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now(),
      };
      const data = await db
        .collection(props.user.uid)
        .add(nuevaTarea);

      setTareas([
        ...tareas,
        { ...nuevaTarea, id: data.id },
      ]);
      setTarea("");
    } catch (error) {
      console.log(error);
    }
    console.log(tarea);
  };

  const eliminarTarea = async (id) => {
    try {
      //const db = firebase.firestore();
      await db.collection(props.user.uid).doc(id).delete();

      const arrayFiltrado = tareas.filter(
        (item) => item.id !== id
      );

      setTareas(arrayFiltrado);
    } catch (error) {
      console.log(error);
    }
  };

  const activarEdicion = (item) => {
    setModoEdicion(true);
    //ligando tarea para ponerla en el campo editar
    setTarea(item.name);
    setId(item.id);
  };

  //form update handler
  const editar = async (e) => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log("Tarea vacia");
      return;
    }

    try {
      //updating the task in firstore
      //const db = firebase.firestore();
      await db.collection(props.user.uid).doc(id).update({
        name: tarea,
      });
      const arrayEditado = tareas.map(
        (item) =>
          item.id === id
            ? {
              id: item.id,
              fecha: item.fecha,
              name: tarea,
            }
            : item
        /*item => retornamos el item sin modificacion*/
      );

      //updating form UI
      setTareas(arrayEditado);

      //cleaning the form
      setModoEdicion(false);
      setTarea("");
      setId("");
    } catch (error) {
      console.log(error);
    }
  };

  //pagination for tasks
  const siguiente = async () => {
    console.log("siguiente")
    try {
      const data = await db.collection(props.user.uid)
        .limit(2)
        .orderBy("fecha")
        .startAfter(ultimo)
        .get()

      const arrayData = data.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setTareas([
        ...tareas,
        //flating the array collection
        ...arrayData
      ])
      setUltimo(data.docs[data.docs.length - 1])

      const query = await db.collection(props.user.uid)
        .limit(2)
        .orderBy("fecha")
        .startAfter(data.docs[data.docs.length - 1])
        .get();
      if (query.empty) {
        console.log("No hay mas documetos ")
        setDesactivar(true)
      } else {
        setDesactivar(false)
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="container mt-3">

      <hr className="mb-3" />
      <div className="row ">
        <div className="col-md-6">
          <ul className="list-group">
            {tareas.map((item) => (
              <li
                className="list-group-item
              "
                key={item.id}
              >
                {item.name} - {moment(item.fecha).format("LLL")}

                <button
                  className="btn btn-danger btn-sm float-right"
                  onClick={() => eliminarTarea(item.id)}
                >
                  Eliminar
                </button>
                <button
                  className="btn btn-warning btn-sm float-right mr-2"
                  onClick={() => activarEdicion(item)}
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-info btn-block mt-2 btn-sm"
            onClick={() => siguiente()}
            disabled={desactivar}>Siguiente...</button>
        </div>
        <div className="col-md-6">
          <h3>
            {modoEdicion ? "Editar Tarea" : "Agregar Tarea"}
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
            <input
              type="text"
              placeholder="Ingrese Tarea"
              className="form-control mb-2 "
              onChange={(e) => setTarea(e.target.value)}
              value={tarea}
            />
            <button
              className={
                modoEdicion
                  ? "btn btn-warning btn-block"
                  : "btn btn-dark btn-block"
              }
              type="submit"
            >
              {modoEdicion ? "Editar" : "Agregar"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Firestore;