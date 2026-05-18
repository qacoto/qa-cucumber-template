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
        sh 'rm -rf cypress/screenshots cypress/videos cypress/reports || true'
      }
    }

    stage('Start Container') {
      steps {
        sh 'docker compose up -d'
      }
    }

    stage('Run Cypress tests') {
      steps {
        script {

          def exitCode = sh(
            script: 'docker compose exec app npm run cy:run',
            returnStatus: true
          )

          currentBuild.result = (exitCode != 0) ? 'UNSTABLE' : 'SUCCESS'

        }
      }
    }

    stage('Generate Allure report') {
      steps {
        sh 'docker compose exec app npm run report:allure || true'
      }
    }

    stage('Copy artifacts') {
      steps {
        sh '''
          CONTAINER_ID=$(docker compose ps -q app)
          docker cp $CONTAINER_ID:/e2e/cypress/reports ./cypress/ || true
          docker cp $CONTAINER_ID:/e2e/cypress/screenshots ./cypress/ || true
          docker cp $CONTAINER_ID:/e2e/cypress/videos ./cypress/ || true
        '''
      }
    }

    stage('Publish Allure report') {
      steps {

        allure([
          includeProperties: false,
          jdk: '',
          properties: [],
          reportBuildPolicy: 'ALWAYS',
          results: [[path: 'cypress/reports/allure-results']],
          commandline: 'allure'
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