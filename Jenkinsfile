pipeline {
  agent any

  stages {
    stage('Build') {
      when { expression { params.Run == true} }
      steps {
		dir('docker') {
		sh 'docker-compose build'
		}
      }
    }
  }
}
