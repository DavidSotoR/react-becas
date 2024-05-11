import { useState } from "react";
import Navbar from "../../NavBar/NavBar";

function ESE12() {

  const [ingresoPadre, setIngresoPadre] = useState([
    {
      "ingreso_nombre": "Sueldo Neto MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Aguinaldo ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Fondo de ahorro ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Bono de Productividad ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Comisiones ventas MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Bonos de despensa MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Vales de gasolina MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Prima Vacacional ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Renta MENSUAL",
      "ingreso_total": "0.00"
    }
  ]
  );
  const [ingresoMadre, setIngresoMadre] = useState([
    {
      "ingreso_nombre": "Sueldo Neto MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Aguinaldo ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Fondo de ahorro ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Bono de Productividad ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Comisiones ventas MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Bonos de despensa MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Vales de gasolina MENSUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Prima Vacacional ANUAL",
      "ingreso_total": "0.00"
    },
    {
      "ingreso_nombre": "Renta MENSUAL",
      "ingreso_total": "0.00"
    }
  ]
  );

  const IngresosTabla = ( ingresos, titulo ) => {
    return (
      <div>
        <h6>{titulo}</h6>
        <table>
        <thead>
          <tr>
            <th>Ingreso Nombre</th>
            <th>Ingreso Total</th>
          </tr>
        </thead>
        <tbody>
          {ingresos.map((ingreso, index) => (
            <tr key={index}>
              <td>{ingreso.ingreso_nombre}</td>
              <td>
                <input type="text" class="form-control" placeholder="$0.00"/>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    );
  };

  return (
    <div className="">
        <Navbar></Navbar>
        <div className="container">
          <h3>Familia: Aguilar Sanchez</h3>
          <div className="row">
            <div className="column-5">
              <div class="mb-3">
                <label for="exampleFormControlTextarea1" class="form-label">SITUACION POR LA CUAL SE VEN EN LA NECESIDAD DE PEDIR APOYO DE BECA</label>
                <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <h5>1. Datos de quién(es) solicita(n) la Beca:</h5>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Alumno(s)</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">DOMICILIO PARTICULAR CALLE, NO.</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">COLONIA</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">MUNICIPIO</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">CODIGO POSTAL</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TELEFONO (CELULAR) PADRE</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">TELEFONO (CELULAR) MADRE</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h5>2. Datos del Padre</h5>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Nombre:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Edad:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-3">
              <label for="evive" class="form-label">Vive:</label>
              <select id="evive" class="form-select form-select-sm" aria-label="Small select example">
                <option value="1">Si</option>
                <option value="2">No</option>
              </select>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Direccion:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Ocupacion Actual:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Empresa en que trabaja:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Email:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
            <div className="col-4">
                <div class="mb-3">
                  <label for="exampleFormControlInput1" class="form-label">Tel. de Casa:</label>
                  <input type="text" class="form-control" id="exampleFormControlInput1"/>
                </div>
            </div>
          </div>
        </div>
        <div className="container">
        <div className="row">
          <div className="col-12">
            <h5>3. Datos del Madre</h5>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Nombre:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Edad:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-3">
            <label for="evive" class="form-label">Vive:</label>
            <select id="evive" class="form-select form-select-sm" aria-label="Small select example">
              <option value="1">Si</option>
              <option value="2">No</option>
            </select>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Direccion:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Ocupacion Actual:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Empresa en que trabaja:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Email:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
          <div className="col-4">
              <div class="mb-3">
                <label for="exampleFormControlInput1" class="form-label">Tel. de Casa:</label>
                <input type="text" class="form-control" id="exampleFormControlInput1"/>
              </div>
          </div>
        </div>
        </div>
        <div className="container">
          <h5>1. Ingresos Familiares</h5>
          <h6>NETO: ES SOLAMENTE LIBRE DE IMPUESTOS</h6>
          <div className="row">
            <div className="col-6">{ IngresosTabla(ingresoPadre, 'PADRE') }</div>
            <div className="col-6">{ IngresosTabla(ingresoMadre, 'MADRE') }</div>
          </div>
        </div>
    </div>
  );
}

export default ESE12;