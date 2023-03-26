import express from 'express';
import Poem from '../models/poem.mjs';

const router = express.Router();

// Create a poem
router.post('/', async (req, res) => {
    const poem = new Poem(req.body);

    try {
        const poemToSave = await poem.save();
        res.status(200).json(poemToSave);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a random poem
router.get('/lucky', async (req, res) => {
    try {
        res.status(200).json(await Poem.aggregate([{ $sample: { size: 1 } }]));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get poem
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        res.status(200).json(await Poem.findOne({ _id: id }));
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all poems (paginated)
router.get('/', async (req, res) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    try {
        const poems = await Poem.paginate({}, { offset, limit })
        res.status(200).json(poems);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get poems by poet or poem title
router.get('/search', async (req, res) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    const query = req.query.query || "";
    const filterBy = {
        $or: [
            {
                title: { $regex: new RegExp(query), $options: "i" }
            },
            {
                author: { $regex: new RegExp(query), $options: "i" }
            }
        ]
    };

    try {
        const poems = await Poem.paginate(filterBy, { offset, limit })
        res.status(200).json(poems);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get poems by poem initial
router.get('/initial', async (req, res) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    const letter = req.query.letter || "A";
    const filterBy = {
        title: { $regex: new RegExp(`^${letter}`), $options: "i" }
    };

    try {
        const poems = await Poem.paginate(filterBy, { offset, limit })
        res.status(200).json(poems);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;