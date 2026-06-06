Feature: Login en SauceDemo

  Background:
    Given Estoy en la página de login de SauceDemo

  @Regression @Smoke
  Scenario: Login exitoso con standard_user
    When Ingreso el usuario "standard_user"
    And Ingreso la contraseña "secret_sauce"
    And Hago clic en el botón de login
    Then Debería ver la página de inventario

  @Regression
  Scenario: Login fallido con locked_out_user
    When Ingreso el usuario "locked_out_user"
    And Ingreso la contraseña "secret_sauce"
    And Hago clic en el botón de login
    Then Se muestra el mensaje "Epic sadface: Sorry, this user has been locked out."

  @Regression
  Scenario: Login fallido con credenciales inválidas
    When Ingreso el usuario "usuario_inexistente"
    And Ingreso la contraseña "clave_incorrecta"
    And Hago clic en el botón de login
    Then Se muestra un mensaje de error

  Scenario: Login con usuario vacío
    When Ingreso la contraseña "secret_sauce"
    And Hago clic en el botón de login
    Then Se muestra el mensaje "Epic sadface: Username is required"

  Scenario: Login con contraseña vacía
    When Ingreso el usuario "standard_user"
    And Hago clic en el botón de login
    Then Se muestra el mensaje "Epic sadface: Password is required"
