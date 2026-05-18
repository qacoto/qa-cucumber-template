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

          def exitCode = sh(
            script: '''
              docker run --rm \
                -v "$(pwd):/e2e" \
                -w /e2e \
                qa-cucumber-template-app \
                sh -c "
                  npm run clean

                  npm run cy:run
                  TEST_EXIT_CODE=\\$?

                  npm run report:allure || true

                  exit \\$TEST_EXIT_CODE
                "
            ''',
            returnStatus: true
          )

          if (exitCode != 0) {
            currentBuild.result = 'UNSTABLE'
            echo "Se detectaron tests fallidos. Exit code: ${exitCode}"
          }

        }
      }
    }

    stage('Debug generated files') {
      steps {
        sh '''
          echo "=== Workspace ==="
          pwd

          echo "=== Cypress reports ==="
          ls -R cypress/reports || true

          echo "=== Screenshots ==="
          ls -R cypress/screenshots || true

          echo "=== Videos ==="
          ls -R cypress/videos || true
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

            echo 'Reporte Allure publicado correctamente.'

          } else {

            echo 'No se encontró el reporte HTML de Allure.'

          }
        }
      }
    }

    stage('Archive results') {
      steps {

        sh '''
          mkdir -p \
            cypress/reports \
            cypress/screenshots \
            cypress/videos \
            logs
        '''

        archiveArtifacts(
          artifacts: 'cypress/reports/**',
          fingerprint: true,
          allowEmptyArchive: true
        )

        archiveArtifacts(
          artifacts: 'cypress/screenshots/**',
          fingerprint: true,
          allowEmptyArchive: true
        )

        archiveArtifacts(
          artifacts: 'cypress/videos/**',
          fingerprint: true,
          allowEmptyArchive: true
        )

        archiveArtifacts(
          artifacts: 'logs/**',
          fingerprint: true,
          allowEmptyArchive: true
        )

      }
    }
  }

  post {

    always {

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