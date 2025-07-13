/**
 * Mock de la biblioteca Twilio para pruebas.
 * Implementa las funciones básicas necesarias para las pruebas de intercom.
 */

// Definimos una interfaz básica para el mock de Twilio
interface TwilioMock {
  messages: {
    create: jest.Mock<Promise<{ sid: string }>>;
  };
  calls: {
    create: jest.Mock<Promise<{ sid: string }>>;
  };
  video: {
    rooms: {
      create: jest.Mock<Promise<{ sid: string }>>;
      list: jest.Mock<
        Promise<{ sid: string; uniqueName: string; status: string }[]>
      >;
    };
  };
}

// Constructor mock de Twilio
const twilioMock = jest.fn<() => TwilioMock, []>().mockImplementation(() => ({
  messages: {
    create: jest.fn().mockResolvedValue({ sid: "test-message-id" }),
  },
  calls: {
    create: jest.fn().mockResolvedValue({ sid: "test-call-id" }),
  },
  video: {
    rooms: {
      create: jest.fn().mockResolvedValue({ sid: "test-room-id" }),
      list: jest.fn().mockResolvedValue([
        { sid: "room-1", uniqueName: "test-room-1", status: "in-progress" },
        { sid: "room-2", uniqueName: "test-room-2", status: "completed" },
      ]),
    },
  },
}));

// Exportar el mock usando ES Modules
export default twilioMock;
