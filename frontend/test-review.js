import axios from 'axios';

async function test() {
    try {
        const res = await axios.get('http://localhost:8080/api/reviews');
        console.log("ALL REVIEWS:", res.data);
    } catch (e) {
        console.error("ERROR:", e.message);
    }
}

test();
