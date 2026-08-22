import { FiLock } from 'react-icons/fi'
import Footer from '../../components/footer/Footer'
import Header from '../../components/header/Header'
import './HowItWorks.css'

const steps = [
  {
    number: '01',
    title: 'Create a diary',
    description: 'Choose a cover and name it.',
    className: 'how-step--one',
  },
  {
    number: '02',
    title: 'Add your people',
    description: 'Describe someone or add a photo once.',
    className: 'how-step--two',
  },
  {
    number: '03',
    title: 'Write your day',
    description: 'Your entries are saved on this device.',
    className: 'how-step--three',
  },
  {
    number: '04',
    title: 'Select a moment',
    description: 'Choose the people in it, then click Illustrate.',
    className: 'how-step--four',
  },
  {
    number: '05',
    title: 'Keep a backup',
    description: 'Export your data and import it whenever you need.',
    className: 'how-step--five',
  },
]

function HowItWorks({ currentPage, setCurrentPage }) {
  return (
    <div className="how-page" id="how-it-works">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="how-main">
        <section className="how-intro">
          <h1 className="how-title">How it works</h1>
          <p className="how-subtitle">
            A private diary that can sketch the moments you describe.
          </p>
        </section>

        <section className="how-steps">
          {steps.map((step) => (
            <article className={`how-step ${step.className}`} key={step.number}>
              <p className="how-step__number">{step.number}</p>
              <h2 className="how-step__title">{step.title}</h2>
              <p className="how-step__description">{step.description}</p>
            </article>
          ))}
        </section>

        <p className="how-privacy">
          <FiLock className="how-privacy__icon" />
          <span>No account required. Your diary stays in your browser.</span>
        </p>
      </main>

      <Footer />
    </div>
  )
}

export default HowItWorks
