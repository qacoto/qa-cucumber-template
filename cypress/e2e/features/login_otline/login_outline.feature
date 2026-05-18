Feature: Login en COTO Digital con Examples

  Background:
    Given Estoy en la página de login de COTO Digital

  @APP-1234 @Regression
  Scenario Outline: Acceso exitoso con usuario y contraseña válidos
    When Ingreso un usuario "<usuario>" válido
    And Ingreso una contraseña "<password>" válida
    And Hago clic en el botón de ingresar
    Then Debería ver el nombre del usuario en el header

    Examples:
    | usuario       | password      | 
    | validDni      | validPassword |  
    | validEmail    | validPassword |
    | validUsername | validPassword |

  @APP-4567
  Scenario Outline: Error de acceso con usuario y contraseña incorrectos
    When Ingreso un usuario "<usuario>" incorrecto
    And Ingreso una contraseña "<password>" incorrecta
    And Hago clic en el botón de ingresar
    Then Se muestra un mensaje de error

    Examples:
    | usuario           | password        | 
    | invalidDni        | validPassword   |  
    | invalidEmail      | validPassword   |
    | invalidUsername   | validPassword   |
    | validEmail        | invalidPassword |