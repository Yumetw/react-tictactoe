import Head from 'next/head';
import 'antd/dist/antd.css';
import {Col, Row, Button} from 'antd';
import {useEffect, useState} from "react";
import Minimax from 'tic-tac-toe-minimax';


export default function Home() {
    let [GridData, SetGridData] = useState(['','','','','','','','','']);
    let [BoardData, SetBoardData] = useState([0,1,2,3,4,5,6,7,8]);
    let [PlayerTurn, SetPlayerTurn] = useState(true);
    let [Win, SetWin] = useState(false);
    let [Draw, SetDraw] = useState(false);
    let [ModalTitle, SetModalTitle] = useState("");
    let [ShowModal, SetShowModal] = useState(false);

    /*
        0 1 2
        3 4 5
        6 7 8
    */

    const WinCombination = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    const board = BoardData;
    const difficulty = "Hard";
    const huPlayer = "X";
    const aiPlayer = "O";
    const symbols = {
        huPlayer: huPlayer,
        aiPlayer: aiPlayer
    }

    let AIUpdateGridData = () => {
        if (!PlayerTurn && !Win && !Draw) {
            const { ComputerMove } = Minimax;
            const nextMove = ComputerMove( board, symbols, difficulty );
            try {document.getElementById(nextMove.toString()).style.cursor="default"} catch {}
            SetBoardData([...BoardData.slice(0,nextMove),aiPlayer,...BoardData.slice(nextMove+1)]);
            SetGridData([...GridData.slice(0,nextMove),aiPlayer,...GridData.slice(nextMove+1)]);
            SetPlayerTurn(true);
        }
    }
    AIUpdateGridData();
    let PlayerUpdateGridData = (square_id) => {
        if (PlayerTurn && !Win && !Draw) {
            document.getElementById(square_id.toString()).style.cursor="default";
            SetBoardData([...BoardData.slice(0,square_id),huPlayer,...BoardData.slice(square_id+1)]);
            SetGridData([...GridData.slice(0,square_id),huPlayer,...GridData.slice(square_id+1)]);
            SetPlayerTurn(false);
        }
    };

    console.log(BoardData);
    console.log(GridData);

    const GameState = () => {
        WinCombination.map((line) => {
            const [a,b,c] = line;
            if (GridData[a] && GridData[a] === GridData[b] && GridData[a] === GridData[c]) {
                SetWin(true);
                document.getElementById(a.toString()).style.backgroundColor = '#0F7';
                document.getElementById(b.toString()).style.backgroundColor = '#0F7';
                document.getElementById(c.toString()).style.backgroundColor = '#0F7';
                SetModalTitle("YOU LOST");
                SetShowModal(true);
            }
        })
        let checkDraw = Object.keys(GridData).every((v) => GridData[v])
        if (checkDraw){
            SetDraw(true)
            SetModalTitle("DRAW");
            SetShowModal(true);
        }
    };


    useEffect(() => {
        GameState();
    }, [GridData]);
    console.log(Win,Draw);

    const Modal = () => {
        return (
            <div className="modal">
                <div className="modal_title">{ModalTitle}</div>
                <Button size="large" className="modal_button" onClick={()=>{
                    for (let item of document.getElementsByClassName("game_square")) {
                        item.style.backgroundColor = '#D3D3D3';
                        item.style.cursor = 'pointer';
                    }
                    SetGridData(['','','','','','','','','']);
                    SetBoardData([0,1,2,3,4,5,6,7,8]);
                    SetWin(false);
                    SetDraw(false);
                    SetPlayerTurn(true);
                    SetModalTitle("");
                    SetShowModal(false);}}>
                    New Game
                </Button>
            </div>
        )
    };


    return (
        <div className="App">
          <Head>
              <title>TicTacToe Game</title>
              <link rel="icon" href="/favicon.ico" />
          </Head>

          <div className="game_content" style={{margin:'auto', position: "absolute", top:0, left:0, bottom:0, right:0, display: "table", height: 500, width: 400}}>
              <h1 style={{marginBottom:30, fontSize:35, wordSpacing:10, textAlign:"center", fontFamily:"Georgia", fontWeight: "bold"}}>Tic Tac Toe</h1>
              <Row>
                  {[...Array(9)].map((v, square_id) => {
                      return (
                          <Col className="game_square" span={8} key={square_id} id={square_id} onClick={()=>{if (PlayerTurn && GridData[square_id]=='') {PlayerUpdateGridData(square_id)}}}>{GridData[square_id]}</Col>
                      );
                  })}
              </Row>
          </div>
          <div>{ShowModal ? <Modal/> : null}</div>
        </div>
  );
}
