export default () => {
    console.log("variable: ", process.env.NEXT_PUBLIC_HELLO)
    return <div>variable: {process.env.NEXT_PUBLIC_HELLO}</div>
}