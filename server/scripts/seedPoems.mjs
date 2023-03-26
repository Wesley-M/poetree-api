import '../loadEnvironment.mjs';
import Poem from '../models/poem.mjs';
import poemsJSON from '../data/poems.json' assert { type: "json" };
import connectDB from '../db/conn.mjs';

console.log("Trying to connect to MongoDB...");

connectDB().then(async () => {
    console.log("Connected to MongoDB.\n");
    console.log("Adding poems...");

    let done = 0;

    try {
        await Poem.deleteMany({});

        for (let i = 0; i < poemsJSON.length; i++) {
            const poem = new Poem(poemsJSON[i]);
            try {
                await poem.save();
                console.log(`${done++} / ${poemsJSON.length}`);
            } catch(saveErr) {
                console.log('--');
                console.log('There was an error saving the poem to the database.');
                console.log(poemsJSON[i]['title']);
                console.log('--');
            }
        }
    } catch (err) {
        console.error(err);
    }

    console.log("Poems were added.");
});