// 1. JSON 파일 불러오기
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('writing-list-container');
    
    // 2. 데이터 개수만큼 반복해서 HTML 만들기
    data.writingList.forEach(post => {
      const postHtml = `
        <a href="${post.link}" class="post-item">
          <div class="post-info">
            <h2 class="post-title">${post.title}</h2>
            <span class="post-date">${post.date}</span>

          </div>
          <p class="post-summary">${post.summary}</p>
        </a>
      `;
      
      // 3. 만든 HTML을 바구니에 하나씩 넣기
      container.innerHTML += postHtml;
    });
  })
  .catch(error => console.error('데이터를 불러오는 데 실패했습니다:', error));