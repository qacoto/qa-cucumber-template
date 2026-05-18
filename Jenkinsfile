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
        sh 'docker compose build'
      }
    }

    stage('Run tests and generate Allure report') {
      steps {
        script {

          // Ejecuta Cypress, genera resultados y crea el reporte en el MISMO contenedor
          def exitCode = sh(
            script: "docker compose run --rm app sh -c 'npm run clean && npm run cy:run; npm run report:allure'",
            returnStatus: true
          )

          // Marca el build como UNSTABLE si hubo fallos en tests
          if (exitCode != 0) {
            currentBuild.result = 'UNSTABLE'
            echo "Se detectaron tests fallidos. Exit code: ${exitCode}"
          }

        }
      }
    }

    stage('Debug files') {
      steps {
        sh '''
          echo "=== Jenkins workspace root ==="
          pwd
          echo "=== Root files ==="
          ls -la
          echo "=== Cypress directory ==="
          ls -la cypress 2>/dev/null || echo "cypress dir missing"
          echo "=== Cypress support ==="
          ls -la cypress/support 2>/dev/null || echo "cypress/support dir missing"
          echo "=== Cypress reports ==="
          ls -R cypress/reports 2>/dev/null || echo "cypress/reports dir missing"
        '''
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
  }

  post {

    always {

      // Baja containers aunque falle algo
      sh 'docker compose down --remove-orphans || true'

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