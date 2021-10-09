function quotes({
    quoteElement,
    authorElement,
    errorElement
}) {

    const apiURL = "https://api.quotable.io/random";
    const ROTATING = "rotating";
    const HIDDEN = "hidden";

    async function fetchRandomQuote() {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Could not fetch a new quote');
        const data = await response.json();
        return {
            quote: data.content,
            author: data.author
        };
    }

    const displayQuote = (data) => {
        quoteElement.textContent = `“${data.quote}”`;
        authorElement.textContent = data.author;
    }

    const displayError = (error) => {
        errorElement.textContent = error;
        errorElement.classList.remove(HIDDEN);
    }

    fetchRandomQuote()
        .then(data => displayQuote(data))
        .catch(error => displayError(error));
}

quotes({
    quoteElement: document.getElementsByTagName("cite")[0],
    authorElement: document.getElementsByTagName("small")[0],
    errorElement: document.querySelector(".quote p.error")
});