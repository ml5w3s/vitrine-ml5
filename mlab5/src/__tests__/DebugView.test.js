import { Debug } from '../helpers/Debug.js';

describe('Debug com view registrada', () => {
  const mockView = {
    addLog: jest.fn(),
    addError: jest.fn(),
    updateInfo: jest.fn()
  };

  beforeEach(() => {
    Debug.enabled = true;
    Debug.registerView(mockView);
  });

  test('deve enviar logs para a view', () => {
    Debug.log('API', 'Request iniciada');
    expect(mockView.addLog).toHaveBeenCalledWith('[API] Request iniciada');
  });

  test('deve enviar erros para a view', () => {
    const error = new Error('Falha');
    Debug.error('API', error);
    expect(mockView.addError).toHaveBeenCalledWith('[API] Falha');
  });

  test('deve atualizar informações na view', () => {
    Debug.updateView('route', '/home');
    expect(mockView.updateInfo).toHaveBeenCalledWith('route', '/home');
  });
});
 