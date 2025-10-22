window.function = async function (prompt, image_url, use_openrouter, openrouter_api_key) {
	if (use_openrouter && openrouter_api_key) {
		// Build the content for the message
		let messageContent;
		
		// Add text prompt if provided
		if (prompt && prompt.value) {
			// If no image provided, use simple string content for text-only models
			if (!image_url || !image_url.value) {
				messageContent = prompt.value;
			} else {
				// Use array format for multimodal content
				messageContent = [
					{
						type: 'text',
						text: prompt.value
					},
					{
						type: 'image_url',
						image_url: {
							url: image_url.value
						}
					}
				];
			}
		} else if (image_url && image_url.value) {
			// Image only - use array format
			messageContent = [
				{
					type: 'image_url',
					image_url: {
						url: image_url.value
					}
				}
			];
		} else {
			// If no content provided, return error
			throw new Error('Please provide either a prompt or an image URL');
		}
		
		const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${openrouter_api_key.value}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'qwen/qwen2.5-vl-72b-instruct:free',
				max_tokens: 1000,
				messages: [
					{ 
						role: 'user', 
						content: messageContent 
					}
				],
			}),
		});
		
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
		}
		
		const data = await response.json();
		
		// Check if response has expected structure
		if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
			throw new Error(`Invalid API response structure. Response: ${JSON.stringify(data)}`);
		}
		
		if (!data.choices[0].message || !data.choices[0].message.content) {
			throw new Error(`Invalid message structure in API response. Response: ${JSON.stringify(data)}`);
		}
		
		return data.choices[0].message.content;
	} else {
		return prompt ? prompt.value : 'No input provided';
	}
};
