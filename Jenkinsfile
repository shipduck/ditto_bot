pipeline {
  agent any

  stages {
    stage('Build') {
      steps {
		dir('docker') {
		sh 'docker-compose build'
		}
      }
    }
  }
}
