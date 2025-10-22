window.function = async function (prompt, image_url, use_openrouter, openrouter_api_key) {
	if (use_openrouter && openrouter_api_key) {
		// Build the content array for the message
		const content = [];
		
		// Add text prompt if provided
		if (prompt && prompt.value) {
			content.push({
				type: 'text',
				text: prompt.value
			});
		}
		
		// Add image if provided (supports URL or base64 data URI)
		if (image_url && image_url.value) {
			content.push({
				type: 'image_url',
				image_url: {
					url: image_url.value
				}
			});
		}
		
		// If no content provided, return error
		if (content.length === 0) {
			throw new Error('Please provide either a prompt or an image URL');
		}
		
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${openrouter_api_key.value}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'moonshotai/kimi-vl-a3b-thinking:free',
				messages: [
					{ 
						role: 'user', 
						content: content 
					}
				],
			}),
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
		}
		
		const data = await response.json();
		return data.choices[0].message.content;
	} else {
		return prompt ? prompt.value : 'No input provided';
	}
};
