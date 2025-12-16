import { Debug } from '../helpers/Debug.js';

describe('Debug', () => {
  beforeEach(() => {
    jest.spyOn(console, 'groupCollapsed').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'groupEnd').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('deve logar mensagens com grupo', () => {
    Debug.log('Router', 'Iniciando navegação');

    expect(console.groupCollapsed).toHaveBeenCalledWith('[Router] - Iniciando navegação');
    expect(console.log).not.toThrow();
    expect(console.groupEnd).toHaveBeenCalled();
  });
});
