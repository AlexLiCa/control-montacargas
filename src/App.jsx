import { useState } from "react";
import "./App.css";

function App() {
  const [device, setDevice] = useState(null); // Estado para el dispositivo conectado
  const [server, setServer] = useState(null); // Estado para el server GATT del dispositivo

  // Función para buscar y conectarse a dispositivos Bluetooth
  const connectToDevice = () => {
    navigator.bluetooth
      .requestDevice({ acceptAllDevices: true })
      .then((selectedDevice) => {
        console.log("Conectando a", selectedDevice.name);
        setDevice(selectedDevice);
        return selectedDevice.gatt.connect();
      })
      .then((server) => {
        setServer(server);
      })
      .catch((error) => {
        console.error("Hubo un error al conectarse al dispositivo:", error);
      });
  };

  const sendCommand = async (commandNumber) => {
    if (!server) {
      console.log("No hay una conexión activa con un dispositivo.");
      return;
    }
    // Aquí debes reemplazar con el ID de tu servicio y característica específicos
    const serviceUuid = "service_uuid";
    const characteristicUuid = "characteristic_uuid";
    try {
      const service = await server.getPrimaryService(serviceUuid);
      const characteristic = await service.getCharacteristic(
        characteristicUuid
      );
      // Suponiendo que el dispositivo espera un Uint8Array
      await characteristic.writeValue(new Uint8Array([commandNumber]));
      console.log(`Comando ${commandNumber} enviado`);
    } catch (error) {
      console.error("Error al enviar comando:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {!device && (
          <button onClick={connectToDevice}>
            Conectar a dispositivo Bluetooth
          </button>
        )}
        {device && (
          <div className="controls-container">
            <button className="control-button top-left">Subir</button>
            <button className="control-button top-right">Bajar</button>
            <button className="control-button middle-center">Adelante</button>
            <button className="control-button bottom-left">Izquierda</button>
            <button className="control-button bottom-right">Derecha</button>
            <button className="control-button bottom-center">Atrás</button>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
