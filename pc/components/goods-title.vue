<template>
	<div class="goods-title">
		<div class="line-left"></div>
		<div class="title">
			<slot></slot>
		</div>
		<div class="line-right"></div>
	</div>
</template>

<script>
	export default {
		name: "goodsTitle",
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.goods-title{
		display: flex;
		flex-direction: row;
		justify-content: center;
		// @include flex(row);
		align-items: center;
		.line-left {
			width: 34px;
			height: 2px;
			background: linear-gradient(270deg, #ffff00 0%, rgba(58, 244, 186, 0) 100%);
			border-radius: 6px;
			align-items: center;
			margin-right: 12px;
		}
		
		.title {
			// @include flex(row);
			display: flex;
			flex-direction: row;
			justify-content: center;
			// margin-top: 30rpx;
			color: #ffffff;
			font-weight: 500;
			font-size: 18px;
			line-height: 15px;
		}
		
		.line-right {
			@extend .line-left;
			background: linear-gradient(270deg, rgba(58, 244, 186, 0) 0%, #ffff00 100%);
			margin-left: 12px;
		}
	}
	
</style>