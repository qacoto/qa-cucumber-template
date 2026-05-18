Feature: Login en COTO Digital

  Background:
    Given Estoy en la página de login de COTO Digital

  @APP-1234 @Regression
  Scenario: Acceso exitoso con usuario y contraseña válidos
    When Ingreso un usuario válido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Debería ver el nombre del usuario en el header

  Scenario: Acceso exitoso con email y contraseña válidos
    When Ingreso un email válido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Debería ver el nombre del usuario en el header

  Scenario: Acceso exitoso con DNI y contraseña válidos
    When Ingreso un DNI válido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Debería ver el nombre del usuario en el header

  Scenario: Usuario incorrecto
    When Ingreso un usuario inválido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Se muestra un mensaje de error

  Scenario: Contraseña incorrecta
    When Ingreso un usuario válido
    And Ingreso una contraseña inválida
    And Hago clic en el botón de ingresar
    Then Se muestra un mensaje de error

  Scenario: Email inexistente
    When Ingreso un email inválido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Se muestra un mensaje de error

  Scenario: DNI incorrecto
    When Ingreso un DNI inválido
    And Ingreso una contraseña válida
    And Hago clic en el botón de ingresar
    Then Se muestra un mensaje de error