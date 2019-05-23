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
}
