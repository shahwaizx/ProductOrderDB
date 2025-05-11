pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        // Clone your repo into the Jenkins workspace
        checkout scm
      }
    }

    stage('Inject .env') {
      steps {
        // Copy the hand-placed .env into the workspace
        sh '''
          if [ -f /var/lib/jenkins/DevOps/ProductOrderDB/.env ]; then
            cp /var/lib/jenkins/DevOps/ProductOrderDB/.env .
            echo ".env copied into workspace"
          else
            echo "ERROR: .env not found at /var/lib/jenkins/DevOps/ProductOrderDB/.env"
            exit 1
          fi
        '''
      }
    }

    stage('Build & Deploy') {
      steps {
        sh 'docker compose up -d --build'
      }
    }

    stage('Smoke Test') {
      steps {
        sh 'sleep 10'
        sh 'curl --fail http://localhost:5000'
      }
    }
  }

  post {
    failure {
      echo 'Build failed — tearing down containers.'
      sh 'docker compose down --remove-orphans'
    }
    success {
      echo 'Build succeeded — containers are still running on port 5000.'
    }
  }
}