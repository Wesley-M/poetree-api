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

// Get a random poem id
router.get('/lucky', async (req, res) => {
    try {
        const [randomPoemId] = await Poem.aggregate([{ $sample: { size: 1 } }, { $project: { _id: 1 } }]);
        res.status(200).json(randomPoemId);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

/**
 * Get poems by search query and initial (paginated)
 * 
 * @param offset: pagination offset
 * @param limit: pagination limit
 * @param q: query string
 * @param i: initial
 * 
 * @example: /poems?offset=0&limit=10
 * @example: /poems?q=love
 * @example: /poems?i=a
 * @example: /poems?offset=0&limit=10&q=love&i=a
 * 
 * @returns {Object} Poems
*/
router.get('/search', async (req, res) => {
    const offset = req.query.offset || 0;
    const limit = req.query.limit || 10;

    const query = req.query.q || "";
    const initial = req.query.i || "";

    // Filter by initial
    const initialFilter = {
        title: { $regex: new RegExp(`^${initial}`), $options: "i" }
    };

    // Filter by query (poet or poem title)
    const queryFilter = {
        $or: [
            { title: { $regex: new RegExp(query), $options: "i" } },
            { author: { $regex: new RegExp(query), $options: "i" } }
        ]
    };

    // Combine filters
    const filterBy = {
        $and: [initialFilter, queryFilter]
    };

    try {
        const poems = await Poem.paginate(filterBy, { offset, limit })
        res.status(200).json(poems);
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


export default router;