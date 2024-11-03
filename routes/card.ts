import express from 'express'

import { generateCard } from '../controller/beepCard'

export default (router: express.Router) => {
    router.post('/beep/generate', generateCard)
}