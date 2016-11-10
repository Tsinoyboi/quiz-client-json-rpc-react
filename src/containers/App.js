import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import Error from '../components/Error'
import QuestionForm from '../components/QuestionForm'
import SelectQuizForm from '../components/SelectQuizForm'
import Solution from '../components/Solution'
import { fetchAnswerQuestion } from '../actions/answerActions'
import { fetchNewQuestion } from '../actions/questionActions'
import { fetchGetQuizzes } from '../actions/quizActions'

class App extends Component {
  static propTypes = {
    quiz: PropTypes.object.isRequired,
  }
  componentDidMount() {
    const { 
      dispatch,
      quizzes,
    } = this.props
    dispatch(fetchGetQuizzes())
  }

  handleSubmitAnswer = (questionId, guessId) => {
    const {
      dispatch,
      quiz,
    } = this.props
    const {
      correctCount,
      doneCount,
    } = quiz
    dispatch(fetchAnswerQuestion(questionId, guessId, correctCount, doneCount))
  }

  handleNextQuestion = () => {
    const {
      dispatch,
      quiz,
    } = this.props
    dispatch(fetchNewQuestion())
  }

  render() {
    const {
      quiz,
    } = this.props

    const {
      answers,
      correctCount,
      correctId,
      doneCount,
      error,
      guessId,
      guessIsCorrect,
      question,
      quizId,
      quizzes,
    } = quiz
    const haveQuizzes = undefined !== quizzes
    const quizSelected = undefined !== quizId
    
    if (haveQuizzes && !quizSelected) {
      return (
        <div className='wrapper'>
          <SelectQuizForm quizzes={quizzes}/>
          <div className='wrapper-inner'>
            <Error error={error} />
          </div>
        </div>
      )
    }
    const checked = undefined !== correctId
    
    const submitFunction = (checked ? this.handleNextQuestion : this.handleSubmitAnswer)
    const submitText = (checked ? 'Next Question' : 'Submit')

    return (
      <div className='wrapper'>
        {quizSelected && 
          <div className='wrapper-inner'>
          <Counter
            correctCount={correctCount}
            doneCount={doneCount}
          />
          <QuestionForm
            answers={answers}
            correctId={correctId}
            guessId={guessId}
            onSubmit={submitFunction}
            question={question}
            submitText={submitText}
          />
          <Solution
            answers={answers}
            correctId={correctId}
            guessIsCorrect={guessIsCorrect}
            onClick={this.handleNextQuestion}
          />
        </div>
        }
        <div className='wrapper-inner'>
          <Error error={error} />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  quiz: state.quiz,
})

export default connect(mapStateToProps)(App)