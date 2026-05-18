pipeline {
  agent any

  options {
    ansiColor('xterm')
  }

  environment {
    COMPOSE_PROJECT_NAME = 'qa-cucumber-template'
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build image') {
      steps {
        sh 'docker-compose build'
      }
    }

    stage('Run tests') {
      steps {
        script {

          // Ejecuta Cypress sin cortar el pipeline si fallan tests
          def exitCode = sh(
            script: 'docker-compose run --rm app pnpm run cy:run:report',
            returnStatus: true
          )

          // Marca el build como UNSTABLE si hubo fallos
          if (exitCode != 0) {
            currentBuild.result = 'UNSTABLE'
            echo "Se detectaron tests fallidos. Exit code: ${exitCode}"
          }

        }
      }
    }

    stage('Generate Allure report') {
      steps {

        // Genera reporte Allure sin romper pipeline
        sh 'docker-compose run --rm app pnpm run report:allure || true'

      }
    }

    stage('Publish Allure HTML report') {
      steps {
        script {
          if (fileExists('cypress/reports/allure-report/index.html')) {
            publishHTML([
              allowMissing: false,
              alwaysLinkToLastBuild: true,
              keepAll: true,
              reportDir: 'cypress/reports/allure-report',
              reportFiles: 'index.html',
              reportName: 'Allure HTML Report'
            ])
          } else {
            echo 'No se encontró el reporte HTML de Allure en cypress/reports/allure-report'
          }
        }
      }
    }

    stage('Archive results') {
      steps {

        sh 'mkdir -p cypress/reports cypress/screenshots cypress/videos logs'

        // Reportes Allure (HTML + resultados)
        archiveArtifacts artifacts: 'cypress/reports/allure-report/**', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress/reports/allure-results/**', fingerprint: true, allowEmptyArchive: true

        // Otros reportes/persistencia
        archiveArtifacts artifacts: 'cypress/reports/**', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress/screenshots/**', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'cypress/videos/**', fingerprint: true, allowEmptyArchive: true
        archiveArtifacts artifacts: 'logs/**', fingerprint: true, allowEmptyArchive: true

      }
    }

    stage('Publish Allure (optional)') {
      steps {
        script {

          if (fileExists('cypress/reports/allure-results')) {

            try {

              // Publica reporte Allure si plugin existe
              allure results: [[path: 'cypress/reports/allure-results']]

            } catch (err) {

              echo 'Plugin Allure no disponible en Jenkins.'
              echo 'Los resultados quedaron archivados en artifacts.'

            }

          } else {

            echo 'No se encontraron resultados Allure.'

          }

        }
      }
    }

  }

  post {

    always {

      // Baja containers aunque falle algo
      sh 'docker-compose down --remove-orphans || true'

    }

    unstable {

      echo 'Build marcado como UNSTABLE debido a tests fallidos.'

    }

    failure {

      echo 'Pipeline falló por un error de infraestructura o ejecución.'

    }

    success {

      echo 'Pipeline ejecutado correctamente. Todos los tests pasaron.'

    }

  }
}