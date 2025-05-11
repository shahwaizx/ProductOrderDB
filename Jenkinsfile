pipeline {
  agent any

  environment {
    // where you’ll keep your code (and your hand-placed .env)
    WORKSPACE_DIR = "/var/lib/jenkins/DevOps/ProductOrderDB"
  }

  stages {
    stage('Fetch code') {
      steps {
        script {
          if (fileExists(WORKSPACE_DIR + '/.git')) {
            echo "Directory exists → pulling latest changes"
            sh "cd ${WORKSPACE_DIR} && git pull"
          } else {
            echo "Cloning repo into ${WORKSPACE_DIR}"
            sh "git clone https://github.com/your-username/ProductOrderDB.git ${WORKSPACE_DIR}"
          }
        }
      }
    }

    stage('Ensure .env') {
      steps {
        script {
          def envFile = "${WORKSPACE_DIR}/.env"
          if (fileExists(envFile)) {
            echo "✔  Found existing .env – using that"
          } else {
            echo "⚠️  .env not found, generating from Jenkins credentials"
            withCredentials([string(credentialsId: 'mongo-atlas-uri', variable: 'MONGO_URI')]) {
              sh """
                cat > ${envFile} <<EOF
                MONGO_URI=${MONGO_URI}
                PORT=5000
                EOF
              """
            }
          }
        }
      }
    }

    stage('Build & Deploy') {
      steps {
        dir(WORKSPACE_DIR) {
          // builds image & starts containers as per your docker-compose.yml
          sh "docker compose up -d --build"
        }
      }
    }

    stage('Smoke Test') {
      steps {
        // wait for your app to start
        sh "sleep 10"
        // verify it responds
        sh "curl --fail http://localhost:5000 || (echo 'App did not respond' && exit 1)"
      }
    }
  }

  post {
    always {
      dir(WORKSPACE_DIR) {
        // clean up containers
        sh "docker compose down --remove-orphans"
      }
    }
  }
}
