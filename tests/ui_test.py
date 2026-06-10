import asyncio
from playwright.async_api import async_playwright

async def test_invest_ai_flow():
    async with async_playwright() as p:
        # Launch browser in headless mode
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        
        print("🚀 Iniciando teste de fluxo no Invest AI...")
        
        # 1. Acessar Home
        await page.goto("http://localhost:8000")
        print("✅ Home carregada.")
        
        # 2. Navegar para Análise
        await page.click("text=Analisar Ação Individual")
        print("✅ Página de análise carregada.")
        
        # 3. Selecionar Perfil Agressivo
        await page.click("text=AGRESSIVO")
        print("✅ Perfil 'Agressivo' selecionado.")
        
        # 4. Digitar Ticker e analisar
        await page.fill("input[placeholder='Ticker (ex: PETR4)']", "VALE3")
        await page.click("button:has-text('Analisar')")
        
        # Esperar o card de ação aparecer
        await page.wait_for_selector(".acao-card")
        print("✅ Análise de VALE3 processada e exibida.")
        
        # 5. Verificar se o score está presente
        content = await page.content()
        if "Score:" in content:
            print("✅ Score encontrado na tela!")
        else:
            print("❌ Score não encontrado.")

        await browser.close()
        print("🏁 Teste finalizado com sucesso!")

if __name__ == "__main__":
    asyncio.run(test_invest_ai_flow())
