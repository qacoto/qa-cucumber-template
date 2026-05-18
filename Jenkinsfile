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

    stage('Clean reports') {
      steps {
        sh 'docker compose run --rm app npm run clean'
      }
    }

    stage('Run Cypress tests') {
      steps {
        script {

          def exitCode = sh(
            script: 'docker compose run --rm app npm run cy:run',
            returnStatus: true
          )

          currentBuild.result = (exitCode != 0) ? 'UNSTABLE' : 'SUCCESS'

        }
      }
    }

    stage('Generate Allure report') {
      steps {
        sh 'docker compose run --rm app npm run report:allure || true'
      }
    }

    stage('Publish Allure report') {
      steps {

        publishHTML([
          allowMissing: true,
          alwaysLinkToLastBuild: true,
          keepAll: true,
          reportDir: 'cypress/reports/allure-report',
          reportFiles: 'index.html',
          reportName: 'Allure Report'
        ])

      }
    }

    stage('Archive artifacts') {
      steps {

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

      }
    }

  }

  post {

    always {
      sh 'docker compose down --remove-orphans || true'
    }

  }
}