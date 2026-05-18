pipeline {
  agent any

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
        // Ejecuta el script que limpia, corre los tests y genera resultados
        sh 'docker-compose run --rm app pnpm run cy:run:report'
      }
    }

    stage('Generate Allure report') {
      steps {
        // Genera el reporte Allure (puede fallar si no hay resultados o falta la herramienta)
        sh 'docker-compose run --rm app pnpm run report:allure || true'
      }
    }

    stage('Archive results') {
      steps {
        // Archiva todos los artefactos de reports para visualización en Jenkins
        archiveArtifacts artifacts: 'cypress/reports/**', fingerprint: true
      }
    }

    stage('Publish Allure (optional)') {
      steps {
        script {
          if (fileExists('cypress/reports/allure-results')) {
            try {
              // Intenta publicar usando el plugin de Allure si está instalado
              allure results: [[path: 'cypress/reports/allure-results']]
            } catch (err) {
              echo 'Allure plugin no disponible en este Jenkins. Los resultados están archivados en "cypress/reports".'
            }
          } else {
            echo 'No se encontraron resultados de Allure en cypress/reports/allure-results.'
          }
        }
      }
    }
  }

  post {
    always {
      // Limpia contenedores de compose
      sh 'docker compose down --remove-orphans || true'
    }
  }
}
