window.function = async function (prompt, use_openrouter, openrouter_api_key) {
	if (use_openrouter && openrouter_api_key) {
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${openrouter_api_key.value}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'google/gemma-3-27b-it:free',
				messages: [
					{ role: 'user', content: prompt.value }
				],
			}),
		});
		if (!response.ok) {
			throw new Error(`OpenRouter API error: ${response.statusText}`);
		}
		const data = await response.json();
		return data.choices[0].message.content;
	} else {
		return prompt.value;
	}
};
