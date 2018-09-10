pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        dir(path: 'docker') {
          sh 'docker-compose build'
        }
        
      }
    }
  }
  environment {
    token = 'xoxb-2161018487-411742259925-MwR2rh04n84vTpRwx9HpqIrA'
  }
}