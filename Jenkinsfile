pipeline {
  agent any

  parameters {
    booleanParam(name: "Run", defaultValue: true, description: "")
    booleanParam(name: "Stop", defaultValue: false, description: "")
  }

  stages {
    stage('Build') {
      steps {
        sh '''npm install
npm run build'''
      }
    }
    stage('Run') {
      when { expression { params.Run == true} }
      steps {
        sh '''npm restart'''
      }
    }
    stage('Stop') {
      when { expression { params.Stop == true} }
      steps {
        sh '''npm stop'''
      }
    }
  }
  environment {
    token = 'xoxb-2161018487-411742259925-MwR2rh04n84vTpRwx9HpqIrA'
  }
}
